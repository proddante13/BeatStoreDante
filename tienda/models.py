from django.db import models

# Create your models here.

class Beat(models.Model):
    title = models.CharField(max_length=30)
    key = models.CharField(max_length=7,blank=True, null=True)
    bpm = models.IntegerField(default=90)
    image = models.ImageField(blank=True, null=True)
    audio = models.FileField(upload_to='audio/',blank=True, null=True)

    def __str__(self):
        return self.title + ' - ' + str(self.bpm) + 'BPM'