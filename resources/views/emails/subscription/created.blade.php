@component('mail::message')
# Geetings, Timekeeper!

You have successfully subscribed to Fantasy-Calendar!

We'll be charging you **$[[PRICE]]** on a **[[INTERVAL]]** basis (this price includes VAT). We will also send an actual receipt to your email.

---

You can cancel your subscription at any point from your [profile](https://app.fantasy-calendar.com/profile).

This is to remind you that, if you are an EEA consumer, you may have the right to cancel the contract (“cooling off”) within 14 days of concluding the contract. You must send us clear statement saying that you wish to cancel. We will refund all payments within 14 days thereafter but, if you agreed to us beginning services during the cancellation period, we will deduct reasonable costs to cover the services we performed. For full details, please see our [terms and conditions](https://app.fantasy-calendar.com/terms-and-conditions).

You may be entitled to use an EU online dispute resolution service to assist with any contractual dispute you may have with us. This service can be found at: [http://ec.europa.eu/consumers/odr/](http://ec.europa.eu/consumers/odr/)

Thanks,<br>
The {{ config('app.name') }} team
@endcomponent