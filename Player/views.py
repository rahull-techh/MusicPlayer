from django.shortcuts import render
from django.core.paginator import Paginator
from django.conf import settings
from pathlib import Path
from urllib.parse import quote


def song_list(request):

    songs_folder = Path(settings.MEDIA_ROOT) / "songs"

    songs = []

    if songs_folder.exists():

        for file in sorted(songs_folder.iterdir()):

            if file.is_file() and file.suffix.lower() in [
                ".mp3", ".wav", ".ogg", ".m4a"
            ]:

                songs.append({
                    "id": file.name,
                    "title": file.stem.replace("_", " "),
                    "audio_url": (
                        settings.MEDIA_URL
                        + "songs/"
                        + quote(file.name)
                    ),
                    "image": None,
                })

    paginator = Paginator(songs, 10)

    page_num = request.GET.get("page")

    page_obj = paginator.get_page(page_num)

    context = {
        "page_obj": page_obj
    }

    return render(request, "main.html", context)

#Work done