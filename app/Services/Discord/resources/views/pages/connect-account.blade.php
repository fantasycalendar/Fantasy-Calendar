@push('head')
    <style>
        h1 {
            font-size: 2rem;
        }
        h2 {
            font-size: 1.7rem;
        }
        h3 {
            font-size: 1.4rem;
        }
        h4 {
            font-size: 1.1rem;
        }
        .logo-wrapper {
            height: 6rem;
            width: 6rem;
            display: grid;
            place-items: center;
        }
        .connect-box {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .fa-discord, .discord-color {
            color: #7289DA;
        }
        .discord-bg {
            background-color: #7289DA;
        }
        .btn-discord {
            background-color: #7289DA;
            transition: all 0.2s ease-in-out;
            color: white;
        }
        .btn-discord:hover {
            background-color: #2f855a;
            color: white;
        }
        .bg-accent {
            color: white;
        }
        .bg-accent .alert-link {
            color: white;
        }

        @media only screen and (max-width: 768px) {
            /* Force table to not be like tables anymore */
            table,
            thead,
            tbody,
            th,
            td,
            tr {
                display: block;
            }

            /* Hide table headers (but not display: none;, for accessibility) */
            thead tr {
                position: absolute;
                top: -9999px;
                left: -9999px;
            }

            td {
                /* Behave like a "row" */
                border: none;
                position: relative;
                padding-left: 50%;
                white-space: normal;
                text-align:left;
            }

            td:before {
                /* Now like a table header */
                position: absolute;
                /* Top/left values mimic padding */
                top: 6px;
                left: 6px;
                width: 45%;
                padding-right: 10px;
                white-space: nowrap;
                text-align:left;
                font-weight: bold;
            }

            /*
            Label the data
            */
            td:before { content: attr(data-title); }
        }
    </style>
    <script>
        function confirmDisconnect() {
            swal.fire({
                title: "Are you sure?",
                text: "Your Discord account will be disconnected from Fantasy Calendar. Commands will no longer work for you, but you will still need to remove the app from any servers you don't want it in in order to remove it completely.",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                icon: "warning",
            }).then((result) => {
                if(!result.dismiss) {
                    self.location = '{{ route('discord.auth.remove') }}';
                }
            });
        }
    </script>
@endpush

<x-app-layout>
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">

    </div>
</x-app-layout>
