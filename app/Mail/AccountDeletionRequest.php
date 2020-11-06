<?php

namespace App\Mail;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountDeletionRequest extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User
     */
    private $user;
    private $delete_at;

    /**
     * Create a new message instance.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        $this->delete_requested_at = $this->user->delete_requested_at;
        $this->deleting_at = $this->user->delete_requested_at->addDays(14);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.account.deletion',[
            'user' => $this->user,
            'delete_requested_at' => $this->delete_requested_at->toFormattedDateString(),
            'deleting_at' => $this->deleting_at->toFormattedDateString()
        ]);
    }
}
