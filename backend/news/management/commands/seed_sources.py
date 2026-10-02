from django.core.management.base import BaseCommand

from news.models import Source

SOURCES = [
    ("TechCrunch", "https://techcrunch.com/", "https://techcrunch.com/feed/"),
    ("The Verge", "https://www.theverge.com/", "https://www.theverge.com/rss/index.xml"),
    ("Ars Technica", "https://arstechnica.com/", "https://feeds.arstechnica.com/arstechnica/index"),
]


class Command(BaseCommand):
    help = "Create or update the three configured Beacon Hub RSS sources."

    def handle(self, *args, **options):
        for name, website_url, feed_url in SOURCES:
            source, created = Source.objects.update_or_create(
                feed_url=feed_url,
                defaults={"name": name, "website_url": website_url, "is_active": True},
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"{action} source: {source.name}")