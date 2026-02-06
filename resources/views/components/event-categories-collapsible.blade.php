@props(['calendar' => null])

<div class='row no-gutters input-group'>
    <input type='text' class='form-control name' placeholder='New category name' x-model="new_category_name" @keydown.enter="createNewCategory">

    <div class="input-group-append">
        <button type='button' class='btn btn-primary' @click="createNewCategory" :disabled="categoryCreationIsDisabled"><i class="fa fa-plus"></i></button>
    </div>
</div>

<div class="flex my-2">
    <button class="w-full btn btn-secondary" @click="reordering = true" x-show="!reordering">
        <i class="fa fa-arrows-alt-v"></i> Change order
    </button>
    <button class="w-full btn btn-secondary" @click="reordering = false" x-show="reordering">
        <i class="fa fa-check"></i> Done
    </button>
</div>


<div class='sortable list-group my-2' x-ref="event-categories-sortable">
    <template x-for="(category, index) in categories" :key="index" x-ref="event-categories-sortable-template">
        <x-sortable-item deleteFunction="removeCategory(category.id)">
            <x-slot:inputs>
                <input type='text' class='name-input small-input form-control' x-model.debounce.1000='category.name'/>
            </x-slot:inputs>

            <div>
                <strong> Settings: </strong>

                <div class="flex flex-col">
                    <x-alpine.check-input id="`category_${index}_settings_hide`" x-model='category.category_settings.hide'>
                        Hide category from viewers
                    </x-alpine.check-input>

                    <x-alpine.check-input id="`category_${index}_settings_player_usable`" x-model='category.category_settings.player_usable'>
                        Category usable by players
                    </x-alpine.check-input>
                </div>
            </div>

            <div class='flex flex-col'>
                <strong> Event overrides: </strong>

                <div class="flex flex-col">
                    <x-alpine.check-input id="`category_${index}_event_settings_hide_full`" x-model='category.event_settings.hide_full'>
                        Fully hide event
                    </x-alpine.check-input>

                    <x-alpine.check-input id="`category_${index}_event_settings_hide`" x-model='category.event_settings.hide'>
                        Hide event
                    </x-alpine.check-input>

                    <x-alpine.check-input id="`category_${index}_event_settings_noprint`" x-model='category.event_settings.noprint'>
                        Show event when printing
                    </x-alpine.check-input>
                </div>
            </div>

            <div class='flex flex-col my-2'>
                <div class="flex">
                    <div class='w-full'>
                        Color:
                    </div>

                    <div class='w-full'>
                        Display:
                    </div>
                </div>

                <div class='input-group mt-1 mb-2' x-data="{ colorOptions: ['Dark-Solid', 'Red', 'Pink', 'Purple', 'Deep-Purple', 'Blue', 'Light-Blue', 'Cyan', 'Teal', 'Green', 'Light-Green', 'Lime', 'Yellow', 'Orange', 'Blue-Grey'] }">
                    <select x-model='category.event_settings.color' class='custom-select form-control color_display'>
                        <template x-for="colorOption in colorOptions">
                            <option x-text="colorOption" :value="colorOption" :selected="colorOption == category.event_settings.color"></option>
                        </template>
                    </select>

                    <select x-model='category.event_settings.text' class='custom-select form-control text_display'>
                        <option value="text">Just text</option>
                        <option value="dot">• Dot with text</option>
                        <option value="background">Background</option>
                    </select>
                </div>
            </div>

            <div class='flex mt-1'>
                Event appearance:
            </div>

            <div class='flex'>
                <div class='event' :class='`${category.event_settings.color} ${category.event_settings.text}`'>Event (visible)</div>
                <div class='hidden_event event' :class='`${category.event_settings.color} ${category.event_settings.text}`'>Event (hidden)</div>
            </div>
        </x-sortable-item>
    </template>
</div>

<div class='separator my-2'></div>

<div class='flex flex-col'>
    <strong>Default category</strong>

    <select x-model="default_category" class='form-control'>
        <option value="-1">No default category</option>

        <template x-for="category in categories">
            <option :value="category.id" x-text="category.name" :selected="category.id === default_category"></option>
        </template>
    </select>
</div>
