<div id="event_background" class='basic-background'>
	<div class='basic-container event-basic-container'>
		<div class='basic-wrapper'>
			<form id="event-form" class='basic-form' action="post"> 
				<h3 class='basic-form-heading'>Edit Event</h3>
				<input type='text' class='form-control' id='event_name' name='event_name' placeholder='Event name' autofocus='' />
				<textarea class='form-control' id='event_desc' name='event_desc' placeholder='Event description' autofocus=''></textarea>
				
  				<label for="repeats">Repeats:</label>
				<select class="form-control" id="repeats">
					<option value='once'>Does not repeat</option>
					<optgroup id='date_options' label='Based on date:'>
						<option value='daily'>Daily</option>
						<option value='weekly'>Weekly on Wednesday</option>
						<option value='fortnightly'>Fortnightly on Wednesday</option>
						<option value='monthly_date'>Monthly on this date</option>
						<option value='monthly_weekday'>Monthly on the 1st Wednesday</option>
						<option value='annually_date'>Annually on this date</option>
						<option value='annually_month_weekday'>Annually on this date</option>
						<option value='every_x_day'>Every x day</option>
						<option value='every_x_weekday'>Every x Wednesday</option>
						<option value='every_x_monthly_date'>Every x month on the 3rd</option>
						<option value='every_x_monthly_weekday'>Every x month on the 3rd Wednesday</option>
						<option value='every_x_annually_date'>Every x year on the 3rd of June</option>
						<option value='every_x_annually_weekday'>Every x year on the 3rd Wednesday in June</option>
					</optgroup>
				</select>

				<input type='text' class='form-control' id='event_repeat_x' name='event_repeat_x' placeholder='Repeat every...' autofocus=''/>

				<label id='multimoon' class='form-control'></label>
				<label id='editfield' class='form-control' data-toggle='tooltip' data-animation='false' data-placement='right' title='You cannot edit the repetition field while in this mode. Find the event in the calendar to edit it.'></label>

				<label class='form-control checkbox'>
					<input type='checkbox' id='event_hide_players' name='event_hide_players'> Hide from players  
				</label>

				<label class='form-control checkbox'>
					<input type='checkbox' id='event_dontprint_checkbox' name='event_dontprint_checkbox'> Do not show when printing
				</label>

				<label class='form-control checkbox'>
					<input type='checkbox' id='event_from_checkbox' name='event_from_checkbox' disabled> From this date    
				</label>

				<label class='form-control event_date'>

					<input type='text' class='form-control event_year_range' id='event_from_year' name='event_from_year' placeholder='Year' autofocus='' disabled/>

					<select class="form-control event_month_range procedural_month_list" id="event_from_month" name='event_from_month' placeholder='Month' disabled>
					</select>

					<select class="form-control event_day_range procedural_day_list" id="event_from_day" name='event_from_day' placeholder='Day' parent="event_from_month" disabled>
					</select>

				</label>

				<label class='form-control checkbox'>
					<input type='checkbox' id='event_to_checkbox' name='event_to_checkbox' disabled> to below date  
				</label>

				<label class='form-control event_date'>

					<input type='text' class='form-control event_year_range' id='event_to_year' name='event_to_year' placeholder='Year' autofocus='' disabled/>

					<select class="form-control event_month_range procedural_month_list" id="event_to_month" name='event_to_month' placeholder='Month' disabled>
					</select>

					<select class="form-control event_day_range procedural_day_list" id="event_to_day" name='event_to_day' placeholder='Day' parent="event_to_month" disabled>
					</select>

				</label>

				<list id='event_messagebox'></list>

				<button class='btn btn-lg btn-primary btn-block' type='submit' id='btn_event_save'>Save</button>
				<button class='btn btn-sm btn-danger btn-block' id='btn_event_delete'>Delete</button>
			</form>
		</div>
	</div>
</div>