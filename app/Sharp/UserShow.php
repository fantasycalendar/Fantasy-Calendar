<?php

namespace App\Sharp;

use App\User;
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
        $user = User::findOrFail($id)->makeVisible(['beta_authorised', 'api_token', 'email', 'permissions']);

        return $this->setCustomTransformer(
            "api_token",
            function($api_token, $user, $attribute) {
                return $api_token;
            }
        )->transform($user);
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
              $section->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("username");
              })->addColumn(6, function(ShowLayoutColumn $column) {
                  $column->withSingleField("email");
              });
         })->addSection('Access Info', function(ShowLayoutSection $section) {
             $section->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("beta_authorised");
             })->addColumn(6, function(ShowLayoutColumn $column) {
                 $column->withSingleField("permissions");
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
