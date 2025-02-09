/**
 * Created by Rain on 2020/7/20
 */
import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TracingModule } from '../lib';

describe('http module', () => {
  let service: HttpService;
  let moduleRef: TestingModule;
  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TracingModule.forRoot({
          tracingOption: {},
          tracingConfig: {
            serviceName: 'foo',
            sampler: { param: 1, type: 'const' },
          },
        }),
        HttpModule,
      ],
    }).compile();
    service = moduleRef.get(HttpService);
  });

  it('should start tracing span', async () => {
    const tracer = TracingModule.tracer;
    jest.spyOn(tracer, 'startSpan');
    const result = await service.get('http://hk.jd.com', {}).toPromise();
    expect(tracer.startSpan).toBeCalled;
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    moduleRef.close();
  });
});
