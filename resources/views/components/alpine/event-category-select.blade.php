<div
    x-data="{
        selectedCategory: null,
        get options() {
            return $store.event_categories.categories?.map(category => {
                return {
                    id: category.id,
                    name: category.name,
                    disabled: false
                };
            }) ?? [];
        },
    }"
    x-modelable="selectedCategory"
    {{ $attributes->get('x-model') }}
>
    <x-alpine.select-input x-model="selectedCategory" optionsFrom="options"></x-alpine.select-input>
</div>
