#define STEPS 512
#define STEP_SIZE .05
#define NUM_OCTAVES 5
#define AREA_WIDTH 30.0
#define AREA_HEIGHT 6.0

uniform float iTime;


// 	<www.shadertoy.com/view/XsX3zB>
//	by Nikita Miropolskiy

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

vec2 rot2D(vec2 p, float angle)
{

    angle = radians(angle);
    float s = sin(angle);
    float c = cos(angle);

    return p * mat2(c,s,-s,c);

}

// https://www.shadertoy.com/view/4sSBDG
const float F3 = 0.3333333;
const float G3 = 0.1666667;
float snoise(vec3 p)
{
    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));

    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);

    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;

    vec4 w, d;

    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);

    w = max(0.6 - w, 0.0);

    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);

    w *= w;
    w *= w;
    d *= w;

    return dot(d, vec4(52.0));
}

float fbm(vec3 x)
{
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < NUM_OCTAVES; ++i)
    {
        v += a * snoise(x - 0.05 * vec3(iTime, 0, iTime));
        x = x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

bool cube(vec3 ro, vec3 rd, out float tn, out float tf)
{
    ro -= vec3(0.0, AREA_HEIGHT * .5, 0.0);
	vec3 size = vec3(AREA_WIDTH, AREA_HEIGHT, AREA_WIDTH);

	vec3 m = 1./rd,
         k = abs(m)*size,
         a = -m*ro-k*.5,
         b = a+k;
    tn = max(max(a.x,a.y),a.z);
    tf = min(min(b.x,b.y),b.z);
	return tn < tf && tf > .0;
}

float getDensityAtPoint(vec3 pos)
{
    pos *= .2;

    float alt = pos.y;

    // Can't remember where this is from
    float h = (1.0 - exp(-50.0 * alt)) * exp(-4.0 * alt);
    float v = 4.0 * fbm(pos) * h;

    if (v < 0.001)
    {
        v = 0.0;
    }

    return v;
}

float march(vec3 pos, int maxStep, float step, vec3 dir)
{
    float start, end;
	if(!cube(pos, dir, start, end))
    {
        return 0.0;
    }

    float density = 0.0;

    float depth = max(0.0, start);

    for (int i = 0; i < maxStep && depth < end; i++)
    {
        vec3 p = pos + depth * dir;

        float d = 0.2 * getDensityAtPoint(p);

        density += d;
        if (density >= 1.0)
        {
            return density;
        }

        depth += step;
    }

    return density;
}

#define saturate(x) clamp(x, 0.0, 1.0)

const vec3 _LightDir = normalize(vec3(.2,0.4,.2));
const vec3 _LightColor = vec3(0.8,0.8,1.0);
const vec3 _WorldOrigin = vec3(0.0,-1.0,0.0);

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // ----- Camera: https://www.shadertoy.com/view/MdKGzG
    vec2 uv = (fragCoord.xy - iResolution.xy * .5) / iResolution.y;
    vec2 m = .55 + 0.5 * ((iMouse.xy / iResolution.xy) * 2. - 1.);

    vec3 dir = vec3(uv, 1.);
    dir.yz = rot2D(dir.yz,  90. * m.y);
    dir.xz = rot2D(dir.xz, 180. * m.x);
    // -----

    vec4 sky = 1.35 * vec4(.6,.7,.8, 1.0);
    sky = sky - 0.5 * dir.y;

    vec4 finalColor = vec4(0.0);

	float start, end;
	if(cube(_WorldOrigin, dir, start, end))
	{
		float depth = max(0.0, start);

		for(int i = 0;i<STEPS && depth < end;i++)
		{
			vec3 p = _WorldOrigin + depth * dir;

			depth += STEP_SIZE;
			depth += random3(p).x * .01;

			float d = getDensityAtPoint(p);

			if (d > .2)
			{
				float totalDensity = d + march(p, 100, 0.01, dir);
				totalDensity = saturate((totalDensity - 0.5) / 0.9);

				float shadow = march(p, 20, 0.1, _LightDir);
				finalColor = vec4(3.0 * vec3(totalDensity) * _LightColor * max(.2, (1.0 - shadow)), 0.5 * totalDensity);

				break;
			}
		}
	}

	gl_fragColor = vec4(mix(finalColor.xyz, sky.xyz, 1.0 - finalColor.w), 1);
}
void main(void)
{
	gl_Fragcolor = mainImage( out vec4 fragColor, in vec2 fragCoord );
}
