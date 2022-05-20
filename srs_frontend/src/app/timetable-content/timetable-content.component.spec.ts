import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableContentComponent } from './timetable-content.component';

describe('TimetableContentComponent', () => {
  let component: TimetableContentComponent;
  let fixture: ComponentFixture<TimetableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
