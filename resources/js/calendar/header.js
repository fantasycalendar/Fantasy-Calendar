import $ from 'jquery';


export function slugify(string) {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

export function toggle_sidebar(force = null) {
    if (force === true) {
        $("#input_container").addClass('inputs_collapsed');
        $("#calendar_container").addClass('inputs_collapsed');
        $('#input_collapse_btn').removeClass('is-active');
    } else if (force === false) {
        $("#input_container").removeClass('inputs_collapsed');
        $("#calendar_container").removeClass('inputs_collapsed');
        $('#input_collapse_btn').addClass('is-active');
    } else {
        $("#input_container").toggleClass('inputs_collapsed');
        $("#calendar_container").toggleClass('inputs_collapsed');
        $('#input_collapse_btn').toggleClass('is-active');
    }

    window.localStorage.setItem('inputs_collapsed', $("#input_container").hasClass('inputs_collapsed'));

}
