<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default customer role
        $user->assignRole('customer');

        // Log the user in
        Auth::login($user);

        // Send Welcome Email
        try {
            Mail::send([], [], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Welcome to Mama Africa Marketplace!')
                    ->html("
                        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0e8db; border-radius: 12px; background-color: #fbf9f6;'>
                            <h2 style='color: #8B4513; font-family: serif; text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;'>Welcome to Mama Africa!</h2>
                            <p>Hello <strong>{$user->name}</strong>,</p>
                            <p>Thank you for signing up to <strong>Mama Africa Marketplace</strong>! We are absolutely thrilled to welcome you to our family.</p>
                            <p>Mama Africa is your premium hub for high-end African beauty products, fashion designs, and professional care services across Germany and Ghana.</p>
                            <div style='margin: 30px 0; text-align: center;'>
                                <a href='" . url('/') . "' style='background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold;'>Start Exploring</a>
                            </div>
                            <p>If you have any questions or would like to book a direct service appointment, simply select one of our nearby stores and click <strong>Message on WhatsApp</strong> to chat with an attendant immediately!</p>
                            <p style='margin-top: 40px; border-top: 1px solid #e0d0c0; padding-top: 20px; font-size: 12px; color: #888;'>
                                Warm regards,<br>
                                <strong>The Mama Africa Team</strong>
                            </p>
                        </div>
                    ");
            });
        } catch (\Exception $e) {
            // Log the error but don't crash registration if mailer is not set up
            logger()->error('Failed to send welcome email to ' . $user->email . ': ' . $e->getMessage());
        }

        return redirect('/');
    }
}
