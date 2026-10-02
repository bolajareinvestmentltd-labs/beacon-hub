import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Source",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=160, unique=True)),
                ("website_url", models.URLField(max_length=500)),
                ("feed_url", models.URLField(max_length=500, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("last_checked_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Article",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("original_title", models.CharField(max_length=500)),
                ("title", models.CharField(max_length=500)),
                ("summary", models.TextField()),
                ("canonical_url", models.URLField(max_length=2000)),
                ("published_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("is_published", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("source", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="articles", to="news.source")),
            ],
            options={"ordering": ["-published_at", "-created_at"]},
        ),
        migrations.AddConstraint(
            model_name="article",
            constraint=models.UniqueConstraint(fields=("source", "canonical_url"), name="unique_article_url_per_source"),
        ),
    ]