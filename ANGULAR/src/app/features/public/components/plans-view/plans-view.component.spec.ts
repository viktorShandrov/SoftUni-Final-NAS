import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansViewComponent } from './plans-view.component';

describe('PlansViewComponent', () => {
  let component: PlansViewComponent;
  let fixture: ComponentFixture<PlansViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlansViewComponent]
    });
    fixture = TestBed.createComponent(PlansViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
