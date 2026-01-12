import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNumberConverter } from './base-number-converter';

describe('BaseNumberConverter', () => {
  let component: BaseNumberConverter;
  let fixture: ComponentFixture<BaseNumberConverter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseNumberConverter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseNumberConverter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
