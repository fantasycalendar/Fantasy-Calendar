import Interval from "@/calendar/interval";

export function lcmo(x, y) {
    if(!lcmo_bool(x, y)) {
        return false;
    }

    let x_start = x.offset;
    let y_start = y.offset;

    if(x_start !== y_start) {
        while(x_start !== y_start) {
            while(x_start < y_start) {
                x_start += x.interval;
            }

            while(y_start < x_start) {
                y_start += y.interval;
            }
        }
    }

    let interval = lcm(x.interval, y.interval);

    return new Interval(interval.toString(), x_start);
}

export function lcmo_bool(x, y) {
    return Math.abs(x.offset - y.offset) === 0
        || ((Math.abs(x.offset - y.offset) % gcd(x.interval, y.interval)) === 0);
}

export function gcd(...arr) {
    const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
    return [...arr].reduce((a, b) => _gcd(a, b));
}

export function lcm (n1, n2) {
    return (n1 * n2) / gcd(n1, n2);
}
