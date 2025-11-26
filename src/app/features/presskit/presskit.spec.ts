import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Presskit } from './presskit';

describe('Presskit', () => {
  let component: Presskit;
  let fixture: ComponentFixture<Presskit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Presskit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Presskit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
