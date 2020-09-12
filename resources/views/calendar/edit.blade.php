@extends('templates._calendar')

@push('head')
    <script>
    $(document).ready(function(){

        @include('calendar._loadcalendar')

        preview_date = clone(dynamic_data);
        preview_date.follow = true;

        for(var moon_index in static_data.moons){
            var moon = static_data.moons[moon_index];

            if(moon.granularity == 16){
                moon.granularity = 8;
            }else if(moon.granularity == 32){
                moon.granularity = 24;
            }
        }

        if(static_data.seasons.global_settings.periodic_seasons === undefined){
            static_data.seasons.global_settings.periodic_seasons = true;
        }

        if(static_data.clock.render === undefined){
            static_data.clock.render = static_data.clock.enable;
        }

        if(typeof static_data.clock.crowding == "undefined"){
            static_data.clock.crowding = 0;
        }

        rebuild_calendar('calendar', dynamic_data);

        bind_calendar_events();

        edit_event_ui.bind_events();
        edit_HTML_ui.bind_events();

        set_up_edit_inputs();
        set_up_edit_values();
        set_up_view_values();
        set_up_visitor_values();

        if(has_parent){

            check_last_change(parent_hash, function(change_result){

                parent_last_dynamic_change = new Date(change_result.last_dynamic_change)
                parent_last_static_change = new Date(change_result.last_static_change)

                last_mouse_move = Date.now();
                poll_timer = setTimeout(check_parent_update, 10000);
                instapoll = false;

                $('#rebuild_calendar_btn').click(function(){
                    check_rebuild('calendar');
                    $('.parent_button_container').addClass('hidden');
                    $('#rebuild_calendar_btn').prop('disabled', true);
                    poll_timer = setTimeout(check_parent_update, 10000);
                });

                $(window).focus(function(){
                    check_parent_update();
                })

                registered_mousemove_callbacks['view_update'] = function(){
                    last_mouse_move = Date.now();
                    if(instapoll){
                        instapoll = false;
                        check_parent_update();
                    }
                }
            });

        }

    });

    function check_parent_update(){

        if(document.hasFocus() && (Date.now() - last_mouse_move) < 10000){

            instapoll = false;

            check_last_change(parent_hash, function(change_result){

	    		new_dynamic_change = new Date(change_result.last_dynamic_change)
	    		new_static_change = new Date(change_result.last_static_change)

				if(new_dynamic_change > parent_last_dynamic_change || new_static_change > parent_last_static_change){

					$('.parent_button_container').removeClass('hidden');
					$('#rebuild_calendar_btn').prop('disabled', false);

				}else{

					poll_timer = setTimeout(check_parent_update, 10000);

				}

			});

        }else{

            instapoll = true;

        }

    }

    function check_rebuild(action){

        get_all_data(parent_hash, function(data_result){

            parent_static_data = data_result.static_data;
            parent_dynamic_data = data_result.dynamic_data;
            parent_last_dynamic_change = new Date(data_result.last_dynamic_change);
            parent_last_static_change = new Date(data_result.last_static_change);

            var converted_date = date_converter.get_date(parent_static_data, static_data, parent_dynamic_data, dynamic_data, parent_offset);
            dynamic_data.year = converted_date.year;
            dynamic_data.timespan = converted_date.timespan;
            dynamic_data.day = converted_date.day;
            dynamic_data.epoch = converted_date.epoch;
            dynamic_data.hour = converted_date.hour;
            dynamic_data.minute = converted_date.minute;

            var data = dynamic_date_manager.compare(dynamic_data);

            dynamic_date_manager = new date_manager(dynamic_data.year, dynamic_data.timespan, dynamic_data.day);

            if(preview_date.follow){
                preview_date = clone(dynamic_data);
                preview_date.follow = true;
                preview_date_manager = new date_manager(preview_date.year, preview_date.timespan, preview_date.day);
            }

            current_year.val(dynamic_data.year);

            repopulate_timespan_select(current_timespan, dynamic_data.timespan, false);

            repopulate_day_select(current_day, dynamic_data.day, false);

            display_preview_back_button();

            if((data.rebuild || static_data.settings.only_reveal_today) && preview_date.follow){
                pre_rebuild_calendar('calendar', dynamic_data)
            }else{
                update_current_day(false);
                scroll_to_epoch();
            }

            set_up_view_values();

            evaluate_save_button();

        });

    }

    </script>
@endpush

@section('content')
    <div id="generator_container">
        @include('layouts.calendar-layouts')
        @include('layouts.weather_tooltip')
        @include('layouts.day_data_tooltip')
        @include('layouts.moon_tooltip')
        @include('layouts.event')
        @include('inputs.sidebar.edit')
    </div>
@endsection
