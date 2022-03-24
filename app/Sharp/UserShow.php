<?php

namespace App\Sharp;

use App\Models\User;

use Carbon\CarbonPeriod;
use Code16\Sharp\Dashboard\Widgets\SharpBarGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpPieGraphWidget;
use Code16\Sharp\Show\Layout\ShowLayout;
use Code16\Sharp\Utils\Fields\FieldsContainer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Subscription;

use Code16\Sharp\Dashboard\DashboardQueryParams;
use Code16\Sharp\Dashboard\SharpDashboard;
use Code16\Sharp\Dashboard\Widgets\SharpPanelWidget;
use Code16\Sharp\Dashboard\Widgets\SharpLineGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpGraphWidgetDataSet;
use Carbon\Carbon;

use Code16\Sharp\Show\Fields\SharpShowEntityListField;
use Code16\Sharp\Show\Fields\SharpShowTextField;
use Code16\Sharp\Show\Layout\ShowLayoutColumn;
use Code16\Sharp\Show\Layout\ShowLayoutSection;
use Code16\Sharp\Show\SharpShow;

class UserShow extends SharpShow
{
    /**
     * Retrieve a Model for the form and pack all its data as JSON.
     *
     * @param $id
     * @return array
     */
    public function find($id): array
    {
        $user = User::findOrFail($id);

        $userData = [
            'username' => $user->username,
            'beta_authorised' => $user->beta_authorised ? "Yes" : "No",
            'api_token' => $user->api_token,
            'email' => $user->email,
            'permissions' => $user->isAdmin() ? "Admin" : "Normal User",
            'date_register' => $user->date_register,
            'is_early_supporter' => $user->isEarlySupporter() ? "Yes" : "No",
            'last_visit' => $user->last_visit
        ];

        if($user->stripe_id){
            $subscription = Subscription::whereUserId($user->id)
                ->orderBy('updated_at')
                ->firstOrFail();
            if($subscription && $subscription->stripe_status == "active"){
                $userData = array_merge($userData, [
                    "subscription_stripe_plan" => $subscription->stripe_plan,
                    "stripe_customer_id" => "<a target='_blank' href='https://dashboard.stripe.com/customers/{$user->stripe_id}'>{$user->stripe_id}</a>",
                    "subscription_created_at" => $subscription->created_at->format('Y-m-d H:i:s'),
                    "subscription_updated_at" => $subscription->updated_at->format('Y-m-d H:i:s'),
                    "subscription_ends_at" => optional($subscription->ends_at)->format('Y-m-d H:i:s')
                ]);
            }

        }

        if($user->discord_auth()->exists()) {
            $userData = array_merge($userData, [
                "discord_authed_at" => $user->discord_auth->expires_at->subDays(7)->format('Y-m-d H:i:s'),
                "discord_username" => $user->discord_auth->discord_username,
                "discord_servers_seen_in" => $user->discord_guilds()->count(),
                "last_discord_command" => $user->discord_interactions()->limit(1)->orderByDesc('created_at')->first()?->created_at->format('Y-m-d H:i:s')
            ]);
        }

        return $this->transform($userData);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields(FieldsContainer $showFields): void
    {
        $showFields->addField(
            SharpShowTextField::make("username")
                ->setLabel("Username")
        )->addField(
             SharpShowTextField::make("email")
                 ->setLabel("Email Address")
        )->addField(
             SharpShowTextField::make("date_register")
                 ->setLabel("Date Registered")
        )->addField(
            SharpShowTextField::make("is_early_supporter")
                ->setLabel("Is Early Supporter")
        )->addField(
             SharpShowTextField::make("last_visit")
                 ->setLabel("Last visited")
        )->addField(
             SharpShowTextField::make("subscription_stripe_plan")
                 ->setLabel("Stripe plan")
        )->addField(
             SharpShowTextField::make("stripe_customer_id")
                 ->setLabel("Stripe customer ID")
        )->addField(
             SharpShowTextField::make("subscription_created_at")
                 ->setLabel("Subscription created at")
        )->addField(
             SharpShowTextField::make("subscription_updated_at")
                 ->setLabel("Subscription updated at")
        )->addField(
             SharpShowTextField::make("subscription_ends_at")
                 ->setLabel("Subscription ends at")
        )->addField(
            SharpShowTextField::make("beta_authorised")
                ->setLabel("Beta Authorised")
        )->addField(
            SharpShowTextField::make("permissions")
                ->setLabel("Permission Level")
        )->addField(
            SharpShowTextField::make('api_token')
                ->setLabel("API Key")
        )->addField(
            SharpShowTextField::make('discord_authed_at')
                ->setLabel("Discord Authed At")
        )->addField(
            SharpShowTextField::make('discord_username')
                ->setLabel('Discord Username')
        )->addField(
            SharpShowTextField::make('discord_servers_seen_in')
                ->setLabel('Discord Servers Seen In')
        )->addField(
            SharpShowTextField::make('last_discord_command')
                ->setLabel('Last Discord Command')
        )->addField(
            SharpShowEntityListField::make('user_calendars', 'user_calendars')
                ->setLabel('Calendars')
                ->hideFilterWithValue("user", function($instanceId) {
                    return $instanceId;
                })
        );
    }

    /**
     * Build show layout using ->addTab() or ->addColumn()
     *
     * @return void
     */
    public function buildShowLayout(ShowLayout $showLayout): void
    {
         $showLayout->addSection('Personal Info', function(ShowLayoutSection $section) {
              $section->addColumn(3, function(ShowLayoutColumn $column) {
                  $column->withSingleField("username");
              })->addColumn(3, function(ShowLayoutColumn $column) {
                  $column->withSingleField("email");
              })->addColumn(3, function(ShowLayoutColumn $column) {
                  $column->withSingleField("date_register");
              })->addColumn(3, function(ShowLayoutColumn $column) {
                  $column->withSingleField("last_visit");
              });
         })->addSection('Customer Info', function(ShowLayoutSection $section) {
              $section->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("subscription_stripe_plan");
              })->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("stripe_customer_id");
              })->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("subscription_created_at");
              })->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("subscription_updated_at");
              })->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("subscription_ends_at");
              });
         })->addSection('Access Info', function(ShowLayoutSection $section) {
             $section->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("permissions");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("beta_authorised");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("is_early_supporter");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("api_token");
             });
         })->addSection('Discord Info', function(ShowLayoutSection $section) {
             $section->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("discord_authed_at");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("discord_username");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("discord_servers_seen_in");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("last_discord_command");
             });
         })->addEntityListSection('user_calendars');
    }

    public function getInstanceCommands(): ?array
    {
        return [
            LoginAsUser::class,
            SendUserResetPassword::class,
            VisitStripeCustomer::class,
            ForceVerifyUserEmail::class,
        ];
    }
}
