from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.core.models import BaseModel
from apps.places.models import Municipality


class Station(models.Model):
    code = models.IntegerField(_("station code"), unique=True)
    name = models.CharField(_("station name"), max_length=100)
    location = gis_models.PointField(_("location"), srid=4326, geography=True)

    class Meta:
        verbose_name = _("weather station")
        verbose_name_plural = _("weather stations")
        ordering = ["code"]

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def longitude(self):
        return self.location.x

    @property
    def latitude(self):
        return self.location.y


class Climate(BaseModel):
    """Stores climate data from weather stations."""

    class SensorDescription(models.TextChoices):
        AIR_TEMP_2m = "t2m", _("air temperature at 2 m")

    class MeasureUnit(models.TextChoices):
        CELSIUS = "°C", _("Celsius")

    municipality = models.ForeignKey(
        Municipality,
        on_delete=models.PROTECT,
        related_name="climate_data",
        verbose_name=_("municipality"),
    )
    station = models.ForeignKey(
        Station,
        on_delete=models.PROTECT,
        related_name="climate_data",
        verbose_name=_("weather station"),
    )
    date = models.DateField(_("measurement date"))
    sensor = models.CharField(
        _("sensor description"),
        max_length=3,
        choices=SensorDescription,
        default=SensorDescription.AIR_TEMP_2m,
    )
    value = models.FloatField(_("measured value"))
    measure_unit = models.CharField(
        _("measurement unit"),
        max_length=2,
        choices=MeasureUnit,
        default=MeasureUnit.CELSIUS,
    )

    class Meta:
        verbose_name = _("climate data")
        verbose_name_plural = _("climate data")
        ordering = ["station", "date"]

    def __str__(self):
        return f"{self.station} - {self.date} - {self.value} {self.measure_unit}"
