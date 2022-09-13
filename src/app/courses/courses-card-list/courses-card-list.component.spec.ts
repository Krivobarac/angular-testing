import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {setupCourses} from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        CoursesModule
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });
  }) );


  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const cards = el.queryAll(By.css('.course-card'));
    
    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');
  });


  it("should display the first course", () => {
      component.courses = setupCourses();
      fixture.detectChanges();

      const course = component.courses[0];
      const card = el.query(By.css('.course-card:first-child'));
      const title = el.query(By.css('mat-card-title')).nativeElement.textContent;
      const image = el.query(By.css('img')).nativeElement;

      expect(card).toBeTruthy('Could not find course car');
      expect(title).toBe(course.titles.description);
      expect(image.src).toBe(course.iconUrl);
  });
});
