from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .models import Article
from .serializers import ArticleSerializer


class ArticleListView(ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Article.objects.filter(is_published=True, source__is_active=True)
            .select_related("source")
            .order_by("-published_at", "-created_at")
        )