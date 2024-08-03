# Generated by Django 5.0.6 on 2024-07-25 04:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cpf', models.CharField(max_length=11, null=True, unique=True)),
                ('nome_completo', models.CharField(max_length=255, null=True)),
                ('data_nascimento', models.DateField(null=True)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('telefone', models.CharField(max_length=15, null=True)),
                ('documento_oficial', models.ImageField(blank=True, null=True, upload_to='documentos_oficiais/')),
                ('comprovante_residencia', models.ImageField(blank=True, null=True, upload_to='comprovantes_residencia/')),
            ],
        ),
        migrations.CreateModel(
            name='Equipamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100, null=True)),
                ('fotos', models.ImageField(null=True, upload_to='equipamentos/')),
                ('descricao', models.TextField(null=True)),
                ('preco_diaria', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Disponibilidade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(null=True)),
                ('disponivel', models.BooleanField(default=True)),
                ('horario_final_locacao', models.TimeField(blank=True, null=True)),
                ('equipamento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.equipamento')),
            ],
        ),
        migrations.CreateModel(
            name='Agendamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frete_total', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('frete_entrega', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('frete_coleta', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('data_inicio', models.DateField(null=True)),
                ('data_fim', models.DateField(null=True)),
                ('hora_inicio', models.TimeField(null=True)),
                ('hora_fim', models.TimeField(null=True)),
                ('opcao_frete', models.CharField(max_length=50, null=True)),
                ('logradouro', models.CharField(max_length=255, null=True)),
                ('numero', models.CharField(max_length=10, null=True)),
                ('complemento', models.CharField(blank=True, max_length=255, null=True)),
                ('cliente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.cliente')),
                ('equipamento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='myapp.equipamento')),
            ],
        ),
        migrations.CreateModel(
            name='MyProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]