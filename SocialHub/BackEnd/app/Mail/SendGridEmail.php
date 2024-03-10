<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendGridEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $user_name;
    public $message_text; // Define the property here

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user_name, $message_text)
    {
        $this->user_name = $user_name;
        $this->message_text = $message_text;
    }

    public function build()
    {
      return $this->subject('Hola ' . $this->user_name.', código de inicio de sesión')
        ->view('emails.sendgrid-email')
        ->with(['message_text' => $this->message_text, 'user_name' => $this->user_name]);
    }
}
