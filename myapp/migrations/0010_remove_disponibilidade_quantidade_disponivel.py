# Generated by Django 5.0.6 on 2024-08-02 01:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_agendamento_cep_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='disponibilidade',
            name='quantidade_disponivel',
        ),
    ]
