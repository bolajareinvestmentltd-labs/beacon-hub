from django.db import models


class Source(models.Model):
    name = models.CharField(max_length=160, unique=True)
    website_url = models.URLField(max_length=500)
    feed_url = models.URLField(max_length=500, unique=True)
    is_active = models.BooleanField(default=True)
    last_checked_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Article(models.Model):
    source = models.ForeignKey(Source, on_delete=models.PROTECT, related_name="articles")
    original_title = models.CharField(max_length=500)
    title = models.CharField(max_length=500)
    summary = models.TextField()
    canonical_url = models.URLField(max_length=2000)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["source", "canonical_url"],
                name="unique_article_url_per_source",
            ),
        ]

    def __str__(self):
        return self.title