import $ from 'jquery';


export function copy_link(epoch_data) {

    var year = epoch_data.year;
    var timespan = epoch_data.timespan_number;
    var day = epoch_data.day;

    var link = `${window.location.origin}/calendars/${window.hash}?year=${year}&month=${timespan}&day=${day}`;

    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (window.hide_copy_warning) {
        $.notify(
            "Quick reminder: The copied date will not be visible to\nguests or players due to your calendar's settings.",
            "warn"
        );
    } else {
        $.notify(
            "Copied to clipboard!",
            "success"
        );
    }

}
