from rest_framework import serializers

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    source_name = serializers.CharField(source="source.name", read_only=True)
    source_url = serializers.CharField(source="source.website_url", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "summary",
            "canonical_url",
            "published_at",
            "source_name",
            "source_url",
        ]