import factory
import random
from apps.taxonomy.models import (
    Family,
    Genus,
    Species,
    FunctionalGroup,
    Trait,
    TraitValue,
)
from apps.core.factories import BaseFactory


class FamilyFactory(BaseFactory):
    class Meta:
        model = Family
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Family {n}")


class GenusFactory(BaseFactory):
    class Meta:
        model = Genus
        django_get_or_create = ("name",)

    name = factory.Sequence(lambda n: f"Genus {n}")
    family = factory.SubFactory(FamilyFactory)


class TraitFactory(BaseFactory):
    class Meta:
        model = Trait

    # By default, create carbon sequestration trait
    # Override this in specific tests if needed
    type = Trait.TraitType.CARBON_SEQUESTRATION

    @factory.post_generation
    def ensure_unique_type(self, create, extracted, **kwargs):
        """Ensure we don't create duplicate trait types since type field is unique."""
        if create:
            # Check if another trait with this type exists
            existing = Trait.objects.filter(type=self.type).exclude(pk=self.pk).first()
            if existing:
                # If it exists, return the existing one instead
                self.delete()
                return existing


class FunctionalGroupFactory(BaseFactory):
    class Meta:
        model = FunctionalGroup

    group_id = factory.Sequence(lambda n: n + 1)

    @factory.post_generation
    def traits(self, create, extracted, **kwargs):
        """Add traits to the functional group."""
        if not create:
            return

        if extracted:
            # Add specified traits
            for trait in extracted:
                TraitValueFactory.create(functional_group=self, trait=trait)
        else:
            # Create default traits
            traits = []
            for trait_type in Trait.TraitType:
                trait, _ = Trait.objects.get_or_create(type=trait_type)
                traits.append(trait)

            # Add trait values for each trait
            for trait in traits:
                TraitValueFactory.create(functional_group=self, trait=trait)


class TraitValueFactory(BaseFactory):
    class Meta:
        model = TraitValue
        django_get_or_create = ("trait", "functional_group")

    trait = factory.SubFactory(TraitFactory)
    functional_group = factory.SubFactory(FunctionalGroupFactory)
    min_value = factory.Faker("pyfloat", min_value=0, max_value=50)
    max_value = factory.LazyAttribute(lambda o: o.min_value + random.uniform(10, 100))


class SpeciesFactory(BaseFactory):
    class Meta:
        model = Species

    genus = factory.SubFactory(GenusFactory)
    name = factory.Sequence(lambda n: f"species_{n}")
    accepted_scientific_name = factory.LazyAttribute(
        lambda o: f"{o.genus.name} {o.name}"
    )
    origin = factory.Iterator([choice[0] for choice in Species.Origin.choices])
    iucn_status = factory.Iterator([choice[0] for choice in Species.IUCNStatus.choices])
    life_form = factory.Iterator([choice[0] for choice in Species.LifeForm.choices])
    canopy_shape = factory.Iterator(
        [choice[0] for choice in Species.CanopyShape.choices]
    )
    flower_color = factory.Iterator(
        [choice[0] for choice in Species.FlowerColor.choices]
    )
    gbif_id = factory.Faker("random_int", min=1000, max=9999999)
    identified_by = factory.Faker("name")
    date = factory.Faker("date_this_decade")

    @factory.post_generation
    def create_with_functional_group(self, create, extracted, **kwargs):
        if not create:
            return

        if not self.functional_group:
            # Assign a functional group if not already set
            # Either use an existing one or create a new one
            if FunctionalGroup.objects.exists():
                self.functional_group = FunctionalGroup.objects.order_by("?").first()
            else:
                self.functional_group = FunctionalGroupFactory.create()
            self.save()
