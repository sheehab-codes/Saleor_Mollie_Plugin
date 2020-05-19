# Generated by Django 2.0.8 on 2018-09-13 13:17

import json

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):
    def populate_data(apps, schema_editor):
        CartLine = apps.get_model("checkout", "CartLine")
        for cart_line in CartLine.objects.all():
            if isinstance(cart_line.data, str):
                json_str = cart_line.data
                while isinstance(json_str, str):
                    json_str = json.loads(json_str)
                cart_line.data_new = json_str
                cart_line.save()

    dependencies = [("checkout", "0010_auto_20180822_0720")]

    operations = [
        migrations.AddField(
            model_name="cartline",
            name="data_new",
            field=django.contrib.postgres.fields.jsonb.JSONField(
                blank=True, default=dict
            ),
        ),
        migrations.AlterUniqueTogether(
            name="cartline", unique_together={("cart", "variant", "data_new")}
        ),
        migrations.RunPython(populate_data),
    ]
