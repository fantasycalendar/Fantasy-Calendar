@props(['deleteFunction' => null, 'highlightRowWhen' => null])

<div class="list-group-item px-2 !py-0.5 first-of-type:rounded-t draggable-source" :data-id="index"
     @if($highlightRowWhen)
         :class="{ 'bg-gray-100 dark:bg-white/5': {{ $highlightRowWhen }}}"
     @endif
     x-data="{ collapsed: true }">

    <div class='flex items-center w-full gap-x-2' x-show="deleting !== index">
        <div x-show="reordering"
             class="handle w-[20px] grid place-items-center self-stretch flex-shrink-0 text-center cursor-move">
            <i class="fa fa-bars text-xl hover:text-black hover:dark:text-white"></i>
        </div>
        <div class='cursor-pointer text-xl fa'
             :class="{ 'fa-caret-square-up': !collapsed, 'fa-caret-square-down': collapsed }"
             @click="collapsed = !collapsed" x-show="!reordering">
        </div>

        <div class="flex flex-grow-1 input-group">
            {{ $inputs }}
        </div>

        <div>
            <i class="fa fa-trash text-lg hover:text-red-400 hover:dark:text-red-600 cursor-pointer" @click="deleting = index" x-show="!reordering"></i>
        </div>
    </div>

    <div x-show="deleting === index" class="flex items-center w-full gap-x-2.5" x-cloak>
        <button class="btn btn-success w-10 !px-0 text-center" @if($deleteFunction) @click="{{ $deleteFunction }}" @endif>
            <i class="fa fa-check text-lg"></i>
        </button>

        <div class="flex-grow">Are you sure?</div>

        <button class="btn btn-danger w-10 !px-0 text-center" @click="deleting = -1">
            <i class="fa fa-times text-lg"></i>
        </button>
    </div>

    <div class="flex flex-col px-2.5 py-2.5 space-y-3" x-show="!collapsed && !reordering && deleting === -1">
        {{ $slot }}
    </div>

</div>
