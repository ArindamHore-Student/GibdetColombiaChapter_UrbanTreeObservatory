from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import BiodiversityRecord


@admin.register(BiodiversityRecord)
class BiodiversityRecordAdmin(GISModelAdmin):
    list_display = ("id", "common_name", "species_name", "place_name", "date")
    list_filter = ("date", "species__life_form", "place__municipality")
    search_fields = (
        "common_name",
        "species__name",
        "species__genus__name",
        "place__site",
    )
    raw_id_fields = ("species", "place")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "date"
    list_per_page = 25

    @admin.display(description="Species")
    def species_name(self, obj):
        return f"{obj.species.genus.name} {obj.species.name}" if obj.species else "-"

    @admin.display(description="Site")
    def place_name(self, obj):
        return obj.place.site if obj.place else "-"
