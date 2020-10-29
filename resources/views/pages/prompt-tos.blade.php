@extends("templates._page")

@push('head')
	<style>

		#content {
			height: 100vh;
		}

		@media screen and (max-width: 768px) {
			.btn {
				width: 100%;
			}
		}

		.scroll_box{
			overflow-y: scroll;
			height:50vh;
		}

	</style>

	<script>

		function agreement_form(){
			return {
				agreed: false,
				dismissed: false
			}
		}

	</script>
@endpush

@section("content")

	

	<div class="container p-4" x-data="agreement_form()">

		<div class="alert alert-info" x-show="!dismissed"><a href="#" class="alert-link" style="float: right;" @click="dismissed = true"><i class="fa fa-times"></i></a> Sorry - a lot has changed in the <a class="alert-link" href="{{ route('whats-new') }}">2.0 update</a>, and you'll need to accept the Terms and Conditions, and the Privacy and Cookies Policy before you can continue using the site.</div>

		<h1>{{ $title }}</h1>
		<p><i>Document Version {{ $version }}.0 — {{ $date }}</i></p>
		<div class="scroll_box mb-2 border p-3 rounded">{!! Markdown::convertToHtml($markdown); !!}</div>
		
		<form method="GET" action="{{ route('agreement-accepted', ['intended' => $intended]) }}">

			<div class="form-check border rounded p-2 mb-2">
				<input type="checkbox" class="form-check-input" id="policy_acceptance" name="policy_acceptance" x-model="agreed" required>

				<label class="form-check-label" for="policy_acceptance">By clicking <strong>Agree and Continue</strong>, I agree to the <a target="_blank" href="{{ route('terms-and-conditions') }}">Terms and Conditions</a>, and the <a target="_blank" href="{{ route('privacy-policy') }}">Privacy and Cookies Policy</a></label>
			</div>

			<div class="form-check border rounded p-2 mb-2">
				<input type="checkbox" class="form-check-input" id="marketing_acceptance" name="marketing_acceptance">
				<label class="form-check-label" for="marketing_acceptance">
					<strong>Optional</strong> - Tick here if you would like us to send you emails about our products and special offers<br>
					<small>Don't worry - We won't spam you. We'll only send emails for major updates or new products we develop, and you can withdraw consent anytime on your profile.<small>
				</label>
			</div>

			<button
				type="submit"
				class="btn btn-lg" 
				:disabled="!agreed",
				:class="{
					'btn-secondary': !agreed,
					'btn-primary': agreed
				}"
			>Agree and Continue</button>

		</form>
	
	</div>


@endsection
