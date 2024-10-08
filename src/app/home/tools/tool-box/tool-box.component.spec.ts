import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxComponent } from './tool-box.component';

describe('ToolBoxComponent', () => {
  let component: ToolBoxComponent;
  let fixture: ComponentFixture<ToolBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
