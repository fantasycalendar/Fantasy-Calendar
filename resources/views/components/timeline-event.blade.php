<!-- This example requires Tailwind CSS v2.0+ -->
<div class="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
    <div class="bg-white px-4 py-3 border-b border-gray-200 sm:px-6">
        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div class="ml-4 mt-2">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ $title }}
                </h3>
            </div>
            <div class="ml-4 mt-2 flex-shrink-0">
                {{ $date }}
                <button type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out">
                    Edit
                </button>
            </div>
        </div>
    </div>


    <div class="px-4 py-5 sm:px-6">
        <div class="mt-1 text-sm text-gray-700">
            {{ $slot }}
        </div>
    </div>
</div>
