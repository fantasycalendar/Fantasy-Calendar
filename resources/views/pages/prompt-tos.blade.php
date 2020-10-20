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
			height:50%;
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


	<div class="container p-4 h-100" x-data="agreement_form()">

		<div class="alert alert-info" x-show="!dismissed"><a href="#" class="alert-link" style="float: right;" @click="dismissed = true"><i class="fa fa-times"></i></a> Sorry - a lot has changed in the <a class="alert-link" href="{{ route('whats-new') }}">2.0 update</a>, and you'll need to accept the terms of service before you can continue using the site.</div>

		<h1>{{ $title }}</h1>
		<p><i>{{ $date }}</i></p>
		<div class="scroll_box mb-4">{!! Markdown::convertToHtml($markdown); !!}</div>

		<p>
			<input id='acknowledgement' type='checkbox' class='mr-2' @click="agreed = !agreed"> By clicking <strong>Agree and Continue</strong>, I hereby agree and constent to the <a target="_blank" href="{{ route('terms-of-service') }}">Terms of Service</a>, and the <a target="_blank" href="{{ route('privacy-policy') }}">GDPR Privacy Policy</a></li>
		</p>

		<a class="btn btn-lg" :class="{
			'disabled': agreed == false,
			'btn-secondary': agreed == false,
			'btn-primary': agreed == true
		}" href="{{ route('agreement-accepted', ['intended' => $intended]) }}">Agree and Continue</a>

	</div>

@endsection
