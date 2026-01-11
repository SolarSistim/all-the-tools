import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorseCodeConverter } from './morse-code-converter';

describe('MorseCodeConverter', () => {
  let component: MorseCodeConverter;
  let fixture: ComponentFixture<MorseCodeConverter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorseCodeConverter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorseCodeConverter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
