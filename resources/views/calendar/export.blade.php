@push('head')
    <script>
        function ExportPage() {
            return {
                copy_export($dispatch) {
                    this.$refs.exportbody.select();
                    document.execCommand("copy");

                    $dispatch('notification', {
                        title: 'JSON Copied',
                        body: 'Calendar data copied to clipboard.'
                    });
                },
                save_export() {
                    let file = new Blob([JSON.stringify(JSON.parse(this.$refs.exportbody.value))], {type: "json"});

                    if (window.navigator.msSaveOrOpenBlob) // IE10+
                        window.navigator.msSaveOrOpenBlob(file, "{{ Str::slug($calendar->name) }}.json");
                    else { // Others
                        let a = document.createElement("a");
                        a.href = URL.createObjectURL(file);
                        a.download = "{{ Str::slug($calendar->name) }}.json";
                        document.body.appendChild(a);
                        a.click();
                    }
                }
            }
        }
    </script>
@endpush

<x-app-layout>
    <div x-data="ExportPage()">
        <div class='grid md:grid-cols-2 gap-4'>
            <div class="w-full col-span-1">
                <x-button class="w-full justify-center" size="lg" @click="save_export" role="secondary">Save to file</x-button>
            </div>
            <div class="w-full col-span-1">
                <x-button class="w-full justify-center" size="lg" @click="copy_export($dispatch)" role="primary">Copy to clipboard</x-button>
            </div>
            <div class="mb-10 w-full h-full col-span-1 md:col-span-2">
                <x-textarea class="w-full h-96" @click="copy_export($dispatch)" x-ref="exportbody" readonly>@json($exportdata, JSON_PRETTY_PRINT)</x-textarea>
            </div>

        </div>
    </div>
</x-app-layout>
