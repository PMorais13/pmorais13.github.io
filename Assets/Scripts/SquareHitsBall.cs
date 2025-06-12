using UnityEngine;

public class SquareHitsBall : MonoBehaviour
{
    public float cubeSpeed = 2f;
    public Vector3 cubeStart = new Vector3(-2f, 0.5f, 0f);
    public Vector3 cubeEnd = new Vector3(0f, 0.5f, 0f);
    public Vector3 ballStart = new Vector3(0.5f, 0.5f, 0f);
    public Vector3 ballHitForce = new Vector3(5f, 0f, 0f);

    private GameObject cube;
    private GameObject ball;
    private bool hit = false;

    [RuntimeInitializeOnLoadMethod]
    static void Init()
    {
        new GameObject("SquareHitsBall").AddComponent<SquareHitsBall>();
    }

    void Start()
    {
        cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
        cube.transform.position = cubeStart;
        var cubeRb = cube.AddComponent<Rigidbody>();
        cubeRb.useGravity = false;
        cubeRb.isKinematic = true;

        ball = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        ball.transform.position = ballStart;
        var ballRb = ball.AddComponent<Rigidbody>();
        ballRb.useGravity = false;

        var cam = Camera.main;
        if (cam != null)
        {
            cam.transform.position = new Vector3(0f, 2f, -10f);
            cam.transform.LookAt(Vector3.zero);
        }
    }

    void Update()
    {
        if (!hit)
        {
            cube.transform.position = Vector3.MoveTowards(cube.transform.position, cubeEnd, cubeSpeed * Time.deltaTime);
            if (Vector3.Distance(cube.transform.position, cubeEnd) < 0.01f)
            {
                hit = true;
                ball.GetComponent<Rigidbody>().AddForce(ballHitForce, ForceMode.VelocityChange);
            }
        }
    }
}
