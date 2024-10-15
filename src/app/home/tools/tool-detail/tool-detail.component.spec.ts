import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDetailComponent } from './tool-detail.component';

describe('ToolDetailComponent', () => {
  let component: ToolDetailComponent;
  let fixture: ComponentFixture<ToolDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
