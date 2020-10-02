<?php

namespace App;

use App\Notifications\CalendarInvitation;
use App\Notifications\UnregisteredCalendarInvitation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class CalendarInvite extends Model
{
    protected $fillable = [
        'invite_token',
        'expires_on',
        'email',
        'calendar_id'
    ];

    public function calendar() {
        return $this->belongsTo('App\Calendar');
    }

    public function isValid() {
        return $this->expires_on > Carbon::now() && !$this->accepted;
    }

    public function validForCalendar($hash) {
        if(!$this->isValid()) {
            return false;
        }

        if(!$this->calendar->is(Calendar::hash($hash)->first())) {
            return false;
        }

        return true;
    }

    public function validForUser($user) {
        if(!$this->isValid()) {
            return false;
        }

        if($this->email !== $user->email) {
            return false;
        }

        return true;
    }

    public function accept() {
        $this->calendar->users()->attach(User::whereEmail($this->email)->first());
        $this->calendar->save();

        $this->accepted = true;
        $this->save();

        return $this;
    }

    public function transformForCalendar() {
        return [
            'id' => Str::slug($this->email),
            'username' => $this->email,
            'pivot' => [
                'user_role' => 'invited'
            ]
        ];
    }

    public static function generate(Calendar $calendar, $email) {
        return self::create([
            'invite_token' => Hash::make($email),
            'expires_on' => Carbon::now()->addWeek(),
            'email' => $email,
            'calendar_id' => $calendar->id,
        ]);
    }

    public function scopeActive($query) {
        return $query->where('accepted', false)->where('expires_on', '>', Carbon::now());
    }

    public function send() {
        if(!$this->email) {
            throw new \Exception("what");
        }

        if(User::whereEmail($this->email)->exists()) {
            User::whereEmail($this->email)->first()->notify(new CalendarInvitation($this));

            return $this;
        }

        Notification::route('mail', $this->email)
                ->notify(new UnregisteredCalendarInvitation($this));

        return $this;
    }
}
