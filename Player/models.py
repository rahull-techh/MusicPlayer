from django.db import models

# Create your models here.
class Song(models.Model):

    title = models.TextField()
    artist = models.TextField()
    image = models.ImageField()
    duration=models.TextField(max_length=20)
    audio = models.FileField()
    lyrics = models.TextField(blank=True,null=True)
    paginate_by =2

    def __str__(self):
        return self.title
    