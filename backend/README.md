# Beacon Hub news backend

## Local setup (PowerShell, Python 3.12+)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item env.example .env
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
docker compose up -d db redis
python manage.py migrate
python manage.py seed_sources
python manage.py runserver 0.0.0.0:8000
```

Put the generated secret in `SECRET_KEY` and your OpenAI key in `OPENAI_API_KEY` in `backend/.env` before running the scraper. In separate PowerShell windows, run the development worker and scheduler:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A config worker -l INFO -P solo
```

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A config beat -l INFO
```

Scraping runs every day at 06:00 UTC. To trigger a one-off run from another terminal, run `celery -A config call news.tasks.scrape_sources`.

The public endpoint is `GET http://localhost:8000/api/articles/` (`?page_size=24&page=1`). For Next.js set `DJANGO_API_URL=http://localhost:8000/api` locally, and set it to the deployed API base URL in the frontend environment. Add the frontend origin to `CORS_ALLOWED_ORIGINS` in the backend environment.

Use a unique `SECRET_KEY`, `DEBUG=0`, and non-development database credentials outside local development. Run the Celery worker and Beat scheduler under a Linux process manager in production; Windows `-P solo` is for local development only.
