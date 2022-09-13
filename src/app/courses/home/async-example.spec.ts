import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Exemples', () => {
    it('Asynchronus test example with Jasmin done', (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
            console.log('running asssertions')
            test = true;

            expect(test).toBeTrue();

            done();
            
        }, 1000); 
    });

    it('Asynchronus test example - setTimeout()', fakeAsync( () => {
        let test = false;
        let test2 = false;

        setTimeout(() => {
            test2 = true;
        }, 1500); 

        setTimeout(() => {
            console.log('running asssertions')
            test = true;
        }, 1000); 

        // tick(1000); // wait for certain time to async, can be used many times
        // tick(500);
        flush();  // for all asyncs

        expect(test).toBeTrue();
        expect(test2).toBeTrue();
    }) );

    it('Asynchronus test example - plain Promise', fakeAsync( () => {
        let test = false;

        Promise.resolve().then(() => {
            test = true;
        });

        flushMicrotasks();
        // see differences between flush and flushMicrotasks https://www.damirscorner.com/blog/posts/20210702-AngularTestingFlushVsFlushMicrotasks.html
        // as well as tasks and microtasks https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

        expect(test).toBeTruthy();
    }) );

    it('Asynchronus test example - Promises + setTimeout()', fakeAsync( () => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter += 1;
            }, 1000);
        });

        flushMicrotasks();
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(10);

        tick(500);
        expect(counter).toBe(11);
    }) );

    it('Asynchronus test example - Observables', fakeAsync( () => {
        let test = false;

        const test$ = of(true).pipe(delay(1000));

        test$.subscribe(value => {
            test = value;
        })

        tick(1000);
        expect(test).toBeTrue();
    }) );
});