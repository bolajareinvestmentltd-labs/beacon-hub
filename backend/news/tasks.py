import json
import logging
import time
from datetime import UTC, datetime
from urllib.request import Request, urlopen

import feedparser
from bs4 import BeautifulSoup
from celery import shared_task
from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone
from openai import OpenAI

from .models import Article, Source

logger = logging.getLogger(__name__)
MAX_ENTRIES_PER_SOURCE = 12


def _plain_text(value):
    return BeautifulSoup(value or "", "html.parser").get_text(" ", strip=True)


def _published_at(entry):
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if not parsed:
        return None
    return datetime(*parsed[:6], tzinfo=UTC)


def _curate(client, title, excerpt, source_name):
    response = client.responses.create(
        model=settings.OPENAI_MODEL,
        instructions=(
            "Create an independent editorial headline and a factual summary of 2-3 sentences. "
            "Use only the supplied headline and RSS excerpt; do not invent facts or reproduce "
            "sentences from the excerpt. Preserve names, dates, figures, and uncertainty. "
            "Return only a JSON object with string keys title and summary. The source will be "
            "clearly credited and linked alongside this summary."
        ),
        text={"format": {"type": "json_object"}},
        input=json.dumps(
            {"source": source_name, "headline": title, "rss_excerpt": excerpt[:3500]},
            ensure_ascii=True,
        ),
    )
    result = json.loads(response.output_text)
    curated_title = str(result["title"]).strip()
    summary = str(result["summary"]).strip()
    if not curated_title or not summary:
        raise ValueError("The LLM returned an empty title or summary")
    return curated_title[:500], summary


@shared_task(name="news.tasks.scrape_sources")
def scrape_sources():
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY must be configured before scraping")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    published_count = 0
    sources = Source.objects.filter(is_active=True)

    for source in sources:
        try:
            request = Request(
                source.feed_url,
                headers={"User-Agent": "BeaconHubNewsBot/1.0 (+https://www.beacon-hub.com.ng)"},
            )
            with urlopen(request, timeout=20) as response:
                feed = feedparser.parse(response.read())
            if feed.bozo and not feed.entries:
                raise ValueError(f"Unable to parse RSS feed: {feed.bozo_exception}")

            for entry in feed.entries[:MAX_ENTRIES_PER_SOURCE]:
                original_title = _plain_text(entry.get("title"))
                canonical_url = str(entry.get("link", "")).strip()
                if not original_title or not canonical_url.startswith(("https://", "http://")):
                    continue
                if Article.objects.filter(source=source, canonical_url=canonical_url).exists():
                    continue

                excerpt = _plain_text(
                    entry.get("content", [{}])[0].get("value")
                    if entry.get("content")
                    else entry.get("summary") or entry.get("description")
                )
                if not excerpt:
                    logger.info("Skipping feed item without an RSS excerpt: %s", canonical_url)
                    continue

                try:
                    title, summary = _curate(client, original_title, excerpt, source.name)
                    with transaction.atomic():
                        Article.objects.create(
                            source=source,
                            original_title=original_title,
                            title=title,
                            summary=summary,
                            canonical_url=canonical_url,
                            published_at=_published_at(entry),
                            is_published=True,
                        )
                    published_count += 1
                except IntegrityError:
                    logger.info("Feed item was already ingested by another worker: %s", canonical_url)
                except Exception:
                    logger.exception("Could not curate feed item %s", canonical_url)
                    continue

                time.sleep(0.2)

            source.last_checked_at = timezone.now()
            source.save(update_fields=["last_checked_at"])
        except Exception:
            logger.exception("Could not process RSS source %s", source.name)

    return {"published": published_count}