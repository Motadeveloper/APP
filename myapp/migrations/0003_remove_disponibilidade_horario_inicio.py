# Generated by Django 5.0.6 on 2024-07-26 14:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_disponibilidade_horario_inicio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='disponibilidade',
            name='horario_inicio',
        ),
    ]
