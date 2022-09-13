import {ComponentFixture, TestBed, waitForAsync, fakeAsync, flush} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {HomeComponent} from './home.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';
import SpyObj = jasmine.SpyObj;

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesServiceSpy: SpyObj<CoursesService>;

  const filteredCourses = (type: 'BEGINNER' | 'ADVANCED') => setupCourses().filter(course => course.category === type);

  beforeEach(waitForAsync( () => {
    coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }) );

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(filteredCourses('BEGINNER')));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display only advanced courses", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(filteredCourses('ADVANCED')));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display both tabs", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Unexpected number of tabs found');
  });


  // fakeAsync version of the same test
  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync( () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);
    fixture.detectChanges();

    flush()

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toBe(filteredCourses('ADVANCED')[0].titles.description);
 
  }) );


  // waitForAsync version of the same test
  it("should display advanced courses when tab clicked - waitForAsync", waitForAsync( () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
      expect(cardTitles[0].nativeElement.textContent).toBe(filteredCourses('ADVANCED')[0].titles.description);
    });
  }) );

});
