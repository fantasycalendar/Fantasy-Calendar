<?php

namespace App\Http\Controllers;

use App\Events\DateChanged;
use App\Jobs\PrepCalendarForExport;
use App\Services\RendererService\ImageRenderer;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

use Auth;
use App\Models\Calendar;

use App\Jobs\SaveEventCategories;
use App\Jobs\SaveCalendarEvents;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class CalendarController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except('show', 'create', 'renderImage');

        $this->middleware('verified')->except('show', 'create', 'renderImage');

        $this->authorizeResource(Calendar::class, 'calendar', ['except' => 'update']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return view('calendar.list', [
            'title' => "Fantasy Calendar",
            'invitations' => $request->user()->getInvitations(),
            'calendars' => $request->user()
                ->calendars()
                ->without(['events', 'event_categories'])
                ->with(['user'])
                ->withCount(['events', 'event_categories', 'users'])
                ->when($request->get('search'), function($query, $search) {
                    $query->search($search);
                })
                ->paginate(10),
            'shared_calendars' => $request->user()
                ->related_calendars()
                ->where('disabled', '=', 0)
                ->without(['events', 'event_categories'])
                ->with(['user'])
                ->withCount(['events', 'event_categories', 'users'])
                ->when($request->get('search'), function($query, $search) {
                    $query->search($search);
                })
                ->paginate(10, ['*'], 'shared_page'),
            'search' => $request->input('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\Response|\Illuminate\View\View
     */
    public function create()
    {
        return view('calendar.create', [
            'title' => 'New Calendar'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return array|\Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $hash = md5(request('calendar_name').request('dynamic_data').request('static_data').(Auth::user()->id).date("D M d, Y G:i").Str::random(10));

        $static_data = json_decode(request('static_data'), true);

        $calendar = Calendar::create([
            'user_id' => Auth::user()->id,
            'name' => request('name'),
            'dynamic_data' => json_decode(request('dynamic_data')),
            'static_data' => $static_data,
            'hash' => $hash
        ]);

        // Split out Categories first
        $categoryids = SaveEventCategories::dispatchNow(json_decode(request('event_categories'), true), $calendar->id);


        // Now split out events
        $eventids = SaveCalendarEvents::dispatchNow(json_decode(request('events'), true), $categoryids, $calendar->id);

        return [
            'success' => true,
            'hash' => $hash
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param Calendar $calendar
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\Response|\Illuminate\View\View
     */
    public function show(Calendar $calendar)
    {
        return view('calendar.view', [
            'calendar' => $calendar,
        ]);
    }

    public function guidedEmbed(Calendar $calendar)
    {
        return view('calendar.guided_embed', [
            'calendar' => $calendar,
            'sizes' => [
                'auto' => 'Autofill available space',
                'xs' => 'Tiny',
                'sm' => 'Small',
                'md' => 'Medium',
                'lg' => 'Large',
                'xl' => 'Extra Large',
                '2xl' => 'Double Extra Large',
                '3xl' => 'Triple Extra Large',
                'custom' => 'Custom size'
            ],
            'themes' => ImageRenderer\ThemeFactory::getThemeNames(),
            'themeValues' => ImageRenderer\ThemeFactory::getThemesRich()
        ]);
    }

    public function renderImage(Calendar $calendar, $ext)
    {
        if(Gate::denies('view-image', $calendar) && !app()->environment('local')) {
            $pathToFile = public_path('resources/discord/premium-warning.png');
            $headers = ['Content-Type' => 'image/png'];

            return response()->file($pathToFile, $headers);
        }

        if(!in_array($ext, ['png', 'jpg', 'jpeg'])) {
            return redirect()->to(
                route('calendars.image', request()->merge(['calendar' => $calendar->hash, 'ext' => 'png'])->all())
            );
        }

        if(app()->environment('local') && request()->get('debug')) {
            return ImageRenderer::renderMonth($calendar, collect(request()->merge(['ext' => $ext])->all()));
        }

        return response()->stream(function() use ($ext, $calendar) {
            echo ImageRenderer::renderMonth($calendar, collect(request()->merge(['ext' => $ext])->all()));
        }, 200, [
            'Content-Disposition' => 'inline; filename="' . Str::slug(Str::ascii($calendar->name)) . '_' . Str::slug(Str::ascii($calendar->current_date)) . '.'. $ext .'"',
            'Content-Type' => 'image/' . $ext,
            'Last-Modified' => now(),
            'Cache-control' => 'must-revalidate',
            'Expires' => now()->addMinutes(5),
            'Pragma' => 'public'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Calendar $calendar
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\Response|\Illuminate\View\View
     */
    public function edit(Calendar $calendar)
    {
        Auth::user()->acknowledgeMigration();

        return view('calendar.edit', [
            'calendar' => $calendar,
        ]);
    }

    /**
     * Show the form for exporting the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Http\Response|\Illuminate\View\View
     */
    public function export(Calendar $calendar)
    {
        return view('calendar.export', [
            'exportdata' => PrepCalendarForExport::dispatchNow($calendar),
            'calendar' => $calendar
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return array|\Illuminate\Http\Response
     */
    public function update(Request $request, Calendar $calendar)
    {
        // Yes, I know. This isn't how you're supposed to do this. but ... Well. Just look away if you need to.
        if($request->hasAny(['name', 'static_data', 'parent_hash', 'parent_link_date', 'parent_offset', 'event_categories', 'events'])) {
            if(!Auth::user()->can('update', $calendar)) {
                throw new AuthorizationException('Not allowed.');
            }
        }

        if(!Auth::user()->can('advance-date', $calendar)) {
            throw new AuthorizationException('Not allowed.');
        }

        $update_data = $request->only(['name', 'dynamic_data', 'static_data', 'parent_hash', 'parent_link_date', 'parent_offset', 'event_categories', 'events', 'advancement']);
        $categoryids = [];

        if(array_key_exists('dynamic_data', $update_data)) {
            $update_data['dynamic_data'] = json_decode($update_data['dynamic_data']);
        }

        $parent_hash_exists = array_key_exists('parent_hash', $update_data);
        $parent_link_date_exists = array_key_exists('parent_link_date', $update_data);
        $parent_offset_exists = array_key_exists('parent_offset', $update_data);

        if($parent_hash_exists && $parent_link_date_exists && $parent_offset_exists) {

            if($update_data['parent_hash'] != ""){
                $parent_calendar = Calendar::hash($update_data['parent_hash'])->firstOrFail();
                unset($update_data['parent_hash']);
                $update_data['parent_id'] = $parent_calendar->id;
            }else{
                $update_data['parent_id'] = null;
                $update_data['parent_link_date'] = null;
                $update_data['parent_offset'] = null;
            }

        }

        if(array_key_exists('static_data', $update_data)) {

            $static_data = json_decode($update_data['static_data'], true);
            $update_data['static_data'] = $static_data;

            if($calendar->isLinked() && $calendar->structureWouldBeModified($static_data)){
                return response()->json(['error' => 'Calendar structure cannot be edited while linked.'], 403);
            }
        }

        if(array_key_exists('event_categories', $update_data)) {
            $categoryids = SaveEventCategories::dispatchNow(json_decode($update_data['event_categories'], true), $calendar->id);
        }

        if(array_key_exists('advancement', $update_data)) {
            $update_data = array_merge($update_data, json_decode($update_data['advancement'], true));

            unset($update_data['advancement']);
        }

        if(array_key_exists('events', $update_data)) {
            SaveCalendarEvents::dispatchNow(json_decode($update_data['events'], true), $categoryids, $calendar->id);
        }

        $calendar_was_updated = $calendar->update($update_data);

        if($calendar_was_updated == 0) {
            return [ 'success' => false, 'error' => 'Unable to update calendar. Please try again later.'];
        }

        if(isset($parent_calendar) && $parent_hash_exists && $parent_link_date_exists && $parent_offset_exists){
            DateChanged::dispatch($parent_calendar, $parent_calendar->dynamic('epoch'));
        }

        $last_changed = [
            'last_dynamic_change' => $calendar->last_dynamic_change,
            'last_static_change' => $calendar->last_static_change,
        ];

        return [ 'success' => true, 'data'=> true, 'last_changed' => $last_changed ];

    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function legacy(Request $request) {
        if($request->get('action') == 'generate') {
            return redirect('calendars/create', 301);
        }

        if($request->get('action') == 'view') {
            return redirect("calendars/{$request->get('id')}", 301);
        }

        if($request->get('action') == 'edit') {
            return redirect("calendars/{$request->get('id')}/edit", 301);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
