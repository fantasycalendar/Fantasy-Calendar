<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountDeletionLastWarning extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User
     */
    private $user;
    private $delete_requested_at;
    private $deleting_at;

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
        return $this->markdown('emails.account.deletionLastWarning',[
            'user' => $this->user,
            'delete_requested_at' => $this->delete_requested_at->toFormattedDateString(),
            'deleting_at' => $this->deleting_at->toFormattedDateString()
        ]);
    }
}
