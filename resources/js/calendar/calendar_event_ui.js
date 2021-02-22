/* ------------------------------------------------------- */
/* ------------------ Calendar UI class ------------------ */
/* ------------------------------------------------------- */

var old_show_event_ui = {

	bind_events: function(){

		this.event_id							= -1;
		this.db_event_id						= -1;
		this.era_id								= -1;
		this.event_condition_sortables			= [];
		this.delete_droppable					= false;

		this.event_background 					= $('#event_show_background');
		this.close_ui_btn						= show_event_ui.event_background.find('.close_ui_btn');

		this.event_wrapper						= this.event_background.find('.modal-wrapper');
		this.event_name							= this.event_background.find('.event_name');
		this.event_desc							= this.event_background.find('.event_desc');
		this.event_comments						= this.event_background.find('#event_comments');
		this.event_comment_mastercontainer		= this.event_background.find('#event_comment_mastercontainer');
		this.event_comment_container			= this.event_background.find('#event_comment_container');
		this.event_comment_input_container		= this.event_background.find('#event_comment_input_container');
		this.event_comment_input				= this.event_background.find('#event_comment_input');
		this.event_save_btn						= this.event_background.find('#submit_comment');
		this.edit_event_btn				   		= this.event_background.find('.edit_event_btn');

		this.event_comment_mastercontainer.toggleClass('hidden', !Perms.user_can_comment());

		this.event_comment_input.trumbowyg({
			btns: [
				['strong', 'em', 'del'],
				['superscript', 'subscript'],
				['link'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
				['unorderedList', 'orderedList'],
				['removeformat']
			]
		});

		this.event_comment_input_container.hide();
		this.event_comment_input.trumbowyg('disabled', true);

		this.close_ui_btn.click(function(){
			show_event_ui.callback_do_close(function(){
				show_event_ui.clear_ui();
			});
		});

		this.event_wrapper.mousedown(function(event){
			event.stopPropagation();
		});

		this.event_background.mousedown(function(){
			show_event_ui.callback_do_close(function(){
				show_event_ui.clear_ui();
			});
		});

		this.event_save_btn.click(function(){
			submit_new_comment(show_event_ui.event_comment_input.trumbowyg('html'), show_event_ui.db_event_id, show_event_ui.add_comment);
			show_event_ui.event_comment_input.trumbowyg('empty');
		});


		this.edit_event_btn.click(function(){
			show_event_ui.callback_do_close(function(){
				edit_event_ui.edit_event(show_event_ui.event_id);
				show_event_ui.clear_ui();
			});
		});

		$.contextMenu({
			selector: ".comment_context_btn",
			trigger: 'left',
			items: {
				edit: {
					name: "Edit comment",
					icon: "fas fa-edit",
					callback: function(key, opt){
						let element = $(opt.$trigger[0]);
						show_event_ui.start_edit_comment(element);
					},
					disabled: function(key, opt){
						let element = $(opt.$trigger[0]);
						let comment_id = Number(element.attr('comment_index'));
						return !show_event_ui.comments[comment_id].comment_owner;
					},
					visible: function(key, opt){
						let element = $(opt.$trigger[0]);
						let comment_id = Number(element.attr('comment_index'));
						return show_event_ui.comments[comment_id].comment_owner;
					}
				},
				delete: {
					name: "Delete comment",
					icon: "fas fa-trash-alt",
					callback: function(key, opt){
						let element = $(opt.$trigger[0]);
						show_event_ui.delete_comment(element);
					}
				},
			},
			zIndex: 1501
		});

		$(document).on('click', '.submit_edit_comment_btn', function(){
			let button = $(this);

			let comment_index = $(this).attr('comment_index');
			let comment = show_event_ui.comments[comment_index];

			let comment_container = button.closest('.event_comment');
			let comment_id = button.attr('comment_id');
			let comment_text_container = comment_container.find('.comment');
			let edit_comment_container = comment_container.find('.edit_comment_container');
			let content = edit_comment_container.trumbowyg('html');

			if(content == ""){
                $.notify(
                    "Comment cannot be empty."
				);
				return;
			};

			submit_edit_comment(comment_id, content, function(){
				comment_text_container.html(content)
				comment.content = content;
				show_event_ui.cancel_edit_comment(button);
			})
		});

		$(document).on('click', '.cancel_edit_comment_btn', function(){
			show_event_ui.cancel_edit_comment($(this));
		});

	},

	delete_comment(element){
		let comment_index = element.attr('comment_index');
		let comment_id = element.attr('comment_id');
		let comment_container = element.closest('.event_comment');
		swal.fire({
			title: "Delete comment?",
			text: "Are you sure you want to delete this comment? This is irreversible.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'OK',
		}).then((result) => {
			if(!result.dismiss) {
				submit_delete_comment(comment_id, function(){
					$.notify(
						"Removed comment.",
						"success"
					);
					comment_container.remove();
					show_event_ui.comments.splice(comment_index, 1)
				});
			}
		});
	},

	start_edit_comment: function(element){

		let comment_index = element.attr('comment_index');
		let comment_content = show_event_ui.comments[comment_index].content;

		let comment_container = element.closest('.event_comment');

		let comment_text_container = comment_container.find('.comment');
		let edit_comment_container = comment_container.find('.edit_comment_container');

		let submit_edit_comment_btn = comment_container.find('.submit_edit_comment_btn');
		let cancel_edit_comment_btn = comment_container.find('.cancel_edit_comment_btn');

		let comment_context_btn = comment_container.find('.comment_context_btn');

		comment_context_btn.toggleClass('hidden', true);
		comment_text_container.toggleClass('hidden', true);

		submit_edit_comment_btn.toggleClass('hidden', false);
		cancel_edit_comment_btn.toggleClass('hidden', false);

		edit_comment_container.trumbowyg({
			btns: [
				['strong', 'em', 'del'],
				['superscript', 'subscript'],
				['link'],
				['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
				['unorderedList', 'orderedList'],
				['removeformat']
			]
		}).trumbowyg('html', comment_content);

		edit_comment_container.toggleClass('hidden', false);

	},

	cancel_edit_comment: function(element){

		let comment_container = element.closest('.event_comment');

		let comment_text_container = comment_container.find('.comment');
		let edit_comment_container = comment_container.find('.edit_comment_container');

		let comment_context_btn = comment_container.find('.comment_context_btn');
		let submit_edit_comment_btn = comment_container.find('.submit_edit_comment_btn');
		let cancel_edit_comment_btn = comment_container.find('.cancel_edit_comment_btn');

		comment_text_container.toggleClass('hidden', false);
		comment_context_btn.toggleClass('hidden', false);

		cancel_edit_comment_btn.toggleClass('hidden', true);
		submit_edit_comment_btn.toggleClass('hidden', true);

		edit_comment_container.toggleClass('hidden', true).trumbowyg('destroy');

	},

	callback_do_close: function(callback){

		if(show_event_ui.event_comment_input.trumbowyg('html').length > 0) {
			swal.fire({
				title: "Cancel comment?",
				text: "You haven't posted your comment yet, are you sure you want to continue?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: '#d33',
				cancelButtonColor: '#3085d6',
				confirmButtonText: 'OK',
			}).then((result) => {
				if(!result.dismiss) {
					callback();
				}
			});
		} else {
			callback();
		}

	},

	clicked_event: function(item){

		if(item.hasClass('era_event')){

			var id = item.attr('event')|0;
			this.era_id = id;
			this.set_current_event(static_data.eras[id]);

		}else{

			var id = item.attr('event')|0;
			this.event_id = id;
			this.set_current_event(events[show_event_ui.event_id]);

		}


	},

	show_event(event_id){
		this.event_id = event_id;
		var event = events[event_id];
		this.set_current_event(event);
	},

	set_current_event: function(event){

		this.db_event_id = event.id;

		let no_edit = !Perms.can_modify_event(this.event_id) || this.era_id > -1;

		this.edit_event_btn.prop('disabled', no_edit).toggleClass('hidden', no_edit);

		this.event_name.text(event.name);

		this.event_desc.html(event.description).toggleClass('hidden', event.description.length == 0);

		this.event_comments.html('').addClass('loading');

		this.event_comment_mastercontainer.removeClass('hidden');

		this.comments = [];

		if(this.era_id > -1){
			this.event_comment_mastercontainer.addClass('hidden');
		}else if(this.db_event_id !== undefined){
			get_event_comments(this.db_event_id, this.add_comments);
		}else if(Perms.user_can_comment()){
			this.event_comments.html("You need to save your calendar before comments can be added to this event!").removeClass('loading');
		}else{
			this.event_comments.removeClass("loading").addClass('hidden');
		}

		this.event_background.removeClass('hidden');

	},

	add_comments: function(comments){

		show_event_ui.event_comments.removeClass('loading');

		show_event_ui.event_comments.toggleClass('empty', comments == false)

		if(comments != false){

			show_event_ui.event_comments.html('');

			for(var index in comments){

				show_event_ui.add_comment(comments[index]);

			}

		}else{

			show_event_ui.event_comment_mastercontainer.toggleClass('hidden', !Perms.user_can_comment());

			if(Perms.user_can_comment()){
				show_event_ui.event_comments.html("No comments on this event yet... Maybe you'll be the first?")
			}

		}

		if(Perms.user_can_comment()){
			show_event_ui.event_comment_input_container.show().find('button').prop('disable', false);
			show_event_ui.event_comment_input.trumbowyg('disabled', false);
		}else{
			show_event_ui.event_comment_input_container.hide().find('button').prop('disable', true);
			show_event_ui.event_comment_input.trumbowyg('disabled', true);
		}

	},

	add_comment: function(comment){

		show_event_ui.comments.push(comment);

		let comment_index = show_event_ui.comments.length-1;

		var content = [];

		content.push(`<div class='container p-2 rounded event_comment ${comment.comment_owner ? "comment_owner" : ""} ${comment.calendar_owner ? "calendar_owner" : ""}'`);
		content.push(` date='${comment.date}' comment_id='${comment.id}' comment_index='${comment_index}'>`);
			content.push(`<div class='row mb-1'>`);
				content.push(`<div class='col-auto'>`);
					content.push(`<p><span class='username'>${comment.username}${comment.comment_owner ? " (you)" : (comment.calendar_owner ? " (owner)" : "")}</span>`);
					content.push(`<span class='date'> - ${comment.date}</span></p>`);
				content.push(`</div>`);
			if(Perms.user_can_delete_comment(comment)){
				content.push(`<div class='col-auto ml-auto'>`);
					content.push(`<button class='btn btn-sm btn-outline-secondary border-0 comment_context_btn' comment_id='${comment.id}' comment_index='${comment_index}'><i class="fas fa-ellipsis-v"></i></button>`);
					if(comment.comment_owner){
						content.push(`<button class='btn btn-sm btn-primary hidden submit_edit_comment_btn ml-2' comment_id='${comment.id}' comment_index='${comment_index}'>Submit</button>`);
						content.push(`<button class='btn btn-sm btn-danger hidden cancel_edit_comment_btn ml-2' comment_id='${comment.id}' comment_index='${comment_index}'>Cancel</button>`);
					}
				content.push(`</div>`);
			}
			content.push(`</div>`);
			content.push(`<div class='row'>`);
				content.push(`<div class='col'>`);
					content.push(`<div class='comment'>${comment.content}</div>`);
					content.push(`<div class='edit_comment_container hidden'></div>`);
				content.push(`</div>`);
			content.push(`</div>`);
		content.push(`</div>`);

		show_event_ui.event_comments.append(content.join(''))

	},

	clear_ui: function(){

		this.event_id = -1;
		this.db_event_id = -1;
		this.era_id = -1;

		this.event_name.text('');

		this.event_comment_container.addClass('hidden');

		this.event_comments.html('').addClass('loading');

		this.event_comment_input_container.hide().find('button').prop('disable', true);
		this.event_comment_input.trumbowyg('disabled', true);

		this.event_desc.html('').removeClass('hidden');

		this.event_comment_input.trumbowyg('html', '');

		this.event_background.addClass('hidden');

	},
}

var edit_HTML_ui = {

	bind_events: function(){

		this.html_edit_background 				= $('#html_edit_background');
		this.save_btn							= this.html_edit_background.find('#btn_html_save');
		this.close_ui_btn						= this.html_edit_background.find('.close_ui_btn');
		this.trumbowyg							= this.html_edit_background.find('.html_input');

		this.trumbowyg.trumbowyg();

		edit_HTML_ui.save_btn.click(function(){
			edit_HTML_ui.save_html();
		})

		edit_HTML_ui.close_ui_btn.click(function(){
			edit_HTML_ui.clear_ui();
		});

		$(document).on('click', '.html_edit', function(){
			edit_HTML_ui.edit_era_description($(this).closest('.sortable-container').attr('index')|0);
		});

	},

	edit_era_description: function(era_index){

		this.era = static_data.eras[era_index];

		this.set_html();

	},

	set_html: function(){

		this.trumbowyg.trumbowyg('html', this.era.description);

		this.html_edit_background.removeClass('hidden');

	},

	save_html: function(){

		this.era.description = this.trumbowyg.trumbowyg('html');

		evaluate_save_button();

		this.clear_ui();

	},

	clear_ui: function(){

		this.trumbowyg.trumbowyg('html', '');

		this.html_edit_background.addClass('hidden');

	},
}
