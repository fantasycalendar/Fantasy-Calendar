<?php

namespace App\Sharp;

use App\User;

use Carbon\CarbonPeriod;
use Code16\Sharp\Dashboard\Widgets\SharpBarGraphWidget;
use Code16\Sharp\Dashboard\Widgets\SharpPieGraphWidget;
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

        // Replace/complete this code
        $user = User::findOrFail($id);
        $subscription = Subscription::whereUserId($user->id)
            ->orderBy('updated_at')
            ->firstOrFail();

        $userData = [
            'username' => $user->username,
            'beta_authorised' => $user->beta_authorised,
            'api_token' => $user->api_token,
            'email' => $user->email,
            'permissions' => $user->permissions,
            'date_register' => $user->date_register,
            'last_visit' => $user->last_visit
        ];

        if($subscription && $subscription->stripe_status == "active"){
            $userData = array_merge($userData, [
                "subscription_stripe_plan" => $subscription->stripe_plan,
                "subscription_created_at" => Carbon::make($subscription->created_at)->toDateString(),
                "subscription_updated_at" => Carbon::make($subscription->updated_at)->toDateString(),
                "subscription_ends_at" => isset($subscription->ends_at)
                    ? Carbon::make($subscription->ends_at)->toDateString()
                    : null
            ]);
        }

        return $this->transform($userData);
    }

    /**
     * Build show fields using ->addField()
     *
     * @return void
     */
    public function buildShowFields()
    {
        $this->addField(
            SharpShowTextField::make("username")
                ->setLabel("Username:")
        )->addField(
             SharpShowTextField::make("email")
                 ->setLabel("Email Address:")
        )->addField(
             SharpShowTextField::make("date_register")
                 ->setLabel("Date Registered:")
        )->addField(
             SharpShowTextField::make("last_visit")
                 ->setLabel("Last visited:")
        )->addField(
             SharpShowTextField::make("subscription_stripe_plan")
                 ->setLabel("Stripe plan:")
        )->addField(
             SharpShowTextField::make("subscription_created_at")
                 ->setLabel("Subscription created at:")
        )->addField(
             SharpShowTextField::make("subscription_updated_at")
                 ->setLabel("Subscription updated at:")
        )->addField(
             SharpShowTextField::make("subscription_ends_at")
                 ->setLabel("Subscription ends at:")
        )->addField(
            SharpShowTextField::make("beta_authorised")
                ->setLabel("Beta Authorised:")
        )->addField(
            SharpShowTextField::make("permissions")
                ->setLabel("Permission Level:")
        )->addField(
            SharpShowTextField::make('api_token')
                ->setLabel("API Key")
        )->addField(
            SharpShowEntityListField::make('user_calendars', 'user_calendars')
                ->setLabel('Calendars')
                ->hideFilterWithValue("user", function($instanceId) {
                    return $instanceId;
                })
        )->addField(
            SharpShowEntityListField::make('old_calendars', 'old_calendars')
                ->setLabel('Old Calendars')
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
    public function buildShowLayout()
    {
         $this->addSection('Personal Info', function(ShowLayoutSection $section) {
              $section->addColumn(4, function(ShowLayoutColumn $column) {
                  $column->withSingleField("username");
              })->addColumn(4, function(ShowLayoutColumn $column) {
                  $column->withSingleField("email");
              })->addColumn(2, function(ShowLayoutColumn $column) {
                  $column->withSingleField("date_register");
              })->addColumn(2, function(ShowLayoutColumn $column) {
                  $column->withSingleField("last_visit");
              });
         })->addSection('Customer Info', function(ShowLayoutSection $section) {
              $section->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("subscription_stripe_plan");
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
             })->addColumn(12, function(ShowLayoutColumn $column) {
                 $column->withSingleField("api_token");
             });
         })->addEntityListSection('user_calendars')
         ->addEntityListSection('old_calendars');
    }

    function buildShowConfig()
    {
        $this
            ->addInstanceCommand("elevate", GiveUserAppAccess::class)
            ->addInstanceCommand("revoke", RevokeUserAppAccess::class)
            ->addInstanceCommand("impersonate", LoginAsUser::class)
            ->addInstanceCommand("reset_password", SendUserResetPassword::class);

    }
}
