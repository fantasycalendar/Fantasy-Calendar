<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Fantasy Calendar')
    <img src="{{ Vite::asset('resources/images/logo-email.png') }}" class="logo" alt="Fantasy Calendar Logo" style="margin-bottom: 5px;">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
